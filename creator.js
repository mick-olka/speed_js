const schemas = require("./schemas.json");
const words = require("./words.json");
const operations = require("./operations.json");

const rnd = (max) => {
  return Math.floor(Math.random()*max);
}
const rArr = (arr) => {
  return arr[Math.floor(Math.random()*arr.length)];
}
const getReg = (str, i) => {
  return new RegExp(`<${str}${i}>`, "g");
}

//  $var0 $var1... $op0 $op1...
const fillSchema = (schema_data) => {
  let sch = schema_data.text;
  for (let i = 0; i<schema_data.vars; i++) {
    sch = sch.replace(getReg('var', i), rArr(words));
  }
  sch = sch.replace(getReg('rn', 0), Math.floor(Math.random()*10000));
  for (let t = 0; t < schema_data.ops; t++) {
    let op = rArr(operations);
    let op_text = op.text;
    op_text = op_text.replace(getReg('rn', 0), Math.floor(Math.random()*10000));
    console.log(op_text);
    for (let q=0; q<op.vars; q++) {
      op_text = op_text.replace(getReg('var', q), rArr(words));
    }
    sch = sch.replace(getReg('op', t), op_text);
  }
  return sch;
}

module.exports.createText = () => {
  return fillSchema(rArr(schemas));
};