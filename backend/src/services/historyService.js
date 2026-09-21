import { supabaseAdmin, getAuthenticatedSupabaseClient } from '../config/supabase.js';
import logger from '../utils/logger.js';

/**
 * Returns an authenticated Supabase client if a user token is provided,
 * otherwise falls back to the administrative client.
 */
function getSupabaseClient(userToken) {
  if (userToken && typeof userToken === 'string' && userToken.trim() !== '') {
    return getAuthenticatedSupabaseClient(userToken);
  }
  return supabaseAdmin;
}

export async function saveScanRecord(scanData, token = null) {
  const client = getSupabaseClient(token);

  logger.info(
    {
      authenticatedUserId: scanData.user_id,
      scanType: scanData.scan_type,
      hasAuthToken: !!token
    },
    'Persisting scan record to Supabase database'
  );

  try {
    const { data, error } = await client
      .from('scans')
      .insert([scanData])
      .select()
      .single();

    if (error) {
      logger.error(
        {
          error: error.message,
          code: error.code,
          authenticatedUserId: scanData.user_id
        },
        'Failed to insert scan into Supabase database'
      );
      const dbError = new Error(`Database save failed: ${error.message}`);
      dbError.statusCode = 500;
      dbError.code = error.code || 'DB_ERROR';
      dbError.details = process.env.NODE_ENV === 'development' ? error : undefined;
      throw dbError;
    }

    logger.info(
      {
        scanId: data.id,
        authenticatedUserId: scanData.user_id,
        insertedUserId: data.user_id
      },
      'Scan record persisted successfully in database'
    );

    return data;
  } catch (err) {
    logger.error(
      { error: err.message, authenticatedUserId: scanData.user_id },
      'Error in saveScanRecord service'
    );
    throw err;
  }
}

export async function getUserScans(userId, options = {}, token = null) {
  const client = getSupabaseClient(token);
  const page = Math.max(1, parseInt(options.page || 1, 10));
  const limit = Math.min(100, Math.max(1, parseInt(options.limit || 10, 10)));
  const offset = (page - 1) * limit;

  const { type, riskLevel, status, search } = options;

  let query = client
    .from('scans')
    .select('*', { count: 'exact' })
    .eq('user_id', userId);

  if (type) {
    query = query.eq('scan_type', type);
  }

  if (riskLevel) {
    query = query.eq('risk_level', riskLevel);
  }

  if (status) {
    query = query.eq('status', status);
  }

  if (search && search.trim()) {
    query = query.ilike('target', `%${search.trim()}%`);
  }

  query = query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    logger.error({ error: error.message, userId }, 'Error fetching user scans from Supabase');
    throw new Error(`Failed to retrieve scan history: ${error.message}`);
  }

  const totalPages = Math.ceil((count || 0) / limit);

  return {
    scans: data || [],
    pagination: {
      totalItems: count || 0,
      currentPage: page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
}

export async function getScanById(scanId, userId, token = null) {
  const client = getSupabaseClient(token);
  const { data, error } = await client
    .from('scans')
    .select('*')
    .eq('id', scanId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    logger.error({ error: error.message, scanId, userId }, 'Error fetching scan by ID');
    throw new Error(`Failed to retrieve scan: ${error.message}`);
  }

  return data;
}

export async function deleteScanRecord(scanId, userId, token = null) {
  const client = getSupabaseClient(token);
  // First check existence & ownership
  const existing = await getScanById(scanId, userId, token);
  if (!existing) {
    return { found: false };
  }

  const { error } = await client
    .from('scans')
    .delete()
    .eq('id', scanId)
    .eq('user_id', userId);

  if (error) {
    logger.error({ error: error.message, scanId, userId }, 'Error deleting scan from Supabase');
    throw new Error(`Failed to delete scan: ${error.message}`);
  }

  logger.info({ scanId, userId }, 'Scan record deleted successfully from database');
  return { found: true };
}
