export function createExclusiveNumberUpdate<
  ActiveKey extends string,
  InactiveKey extends string,
>(
  activeKey: ActiveKey,
  inactiveKey: InactiveKey,
  value: number,
): Record<ActiveKey | InactiveKey, number> {
  return {
    [activeKey]: value,
    [inactiveKey]: 0,
  } as Record<ActiveKey | InactiveKey, number>;
}
