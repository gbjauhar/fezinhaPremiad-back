export function groupItems(array: any[], property: string) {
  return array.reduce(function (groups, item) {
    const name = item[property];
    const group = groups[name] || (groups[name] = []);
    group.push(item);
    return groups;
  }, {});
}
