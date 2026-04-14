import { t } from 'spacetimedb';

export default t.row({
  id: t.u64(),
  seller_id: t.string(),
  seller_name: t.string(),
  seller_type: t.string(),
  amount_earned: t.u64(),
  sale_type: t.string(),
  x: t.f32(),
  y: t.f32(),
  timestamp: t.u64(),
});
