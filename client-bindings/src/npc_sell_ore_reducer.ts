import { t } from 'spacetimedb';

export default {
  npc_id: t.u32(),
  amount: t.u64(),
  sale_type: t.string(),
  x: t.f32(),
  y: t.f32(),
};
