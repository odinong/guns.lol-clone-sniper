async function fuckingidk(n, junk, pre = "", bag = []) {
  if (pre.length === n) {
    bag.push(pre)
    return
  }
  for (const x of junk) {
    await fuckingidk(n, junk, pre + x, bag)
  }
  return bag
}

export { fuckingidk }
