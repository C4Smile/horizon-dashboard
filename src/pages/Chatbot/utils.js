/**
 *
 * @param {string} text
 * @param {any} all
 * @param {object} options
 * @param {boolean} isGroup
 * @returns
 */
export const parseLine = (text, all, options, isGroup = true) => {
  let localText = text;
  const items = isGroup ? Object.keys(all) : all;
  if (isGroup)
    items.forEach((item) => {
      let line = text.substring(options.text.indexOf("[LIST]") + "[LIST]".length);
      if (isGroup) line = line.replace("[value]", all[item]);
      else {
        // do stuff by entity whenever to string
      }
      while (line.indexOf("[p:") >= 0) {
        const p = line.substring(line.indexOf("[p:") + "[p:".length, line.indexOf("]"));
        const split = p.split(".");
        let value = null;
        while (split.length) {
          value = item[split[0]];
          split.splice(0, 1);
        }
        line = line.replace(line.substring(line.indexOf("[p:"), line.indexOf("]" + 1)), value);
      }
      localText += `\n- ${line}`;
    });

  return localText;
};
