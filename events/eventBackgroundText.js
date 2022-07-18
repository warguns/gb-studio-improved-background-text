const id = "PT_EVENT_BACKGROUND_TEXT";
const groups = ["Plugin Pak", "EVENT_GROUP_DIALOGUE"];
const name = "Display Background Text";

const wrap8Bit = (val) => (256 + (val % 256)) % 256;
const decOct = (dec) => wrap8Bit(dec).toString(8).padStart(3, "0");

const fields = [
  {
    key: "text",
    type: "text",
    placeholder: "",
    multiple: false,
    defaultValue: "",
    flexBasis: "100%",
  },
  {
    key: "x",
    label: "x",
    type: "union",
    types: ["number", "variable", "property"],
    defaultType: "number",
    min: 0,
    max: 255,
    width: "50%",
    defaultValue: {
      number: 0,
      variable: "LAST_VARIABLE",
      property: "$self$:xpos",
    },
  },
  {
    key: "y",
    label: "y",
    type: "union",
    types: ["number", "variable", "property"],
    defaultType: "number",
    min: 0,
    max: 255,
    width: "50%",
    defaultValue: {
      number: 0,
      variable: "LAST_VARIABLE",
      property: "$self$:xpos",
    },
  }
];

const compile = (input, helpers) => {
  const {
    appendRaw,
    _addComment,
    _displayText,
    _overlayWait,
    _addNL,
    _rpn,
    _addCmd,
    _assertStackNeutral,
    _stackPop,
    _loadText,
    stackPtr,
    variableFromUnion,
    temporaryEntityVariable,
  } = helpers;

  const xVar = variableFromUnion(input.x, temporaryEntityVariable(0));
  const yVar = variableFromUnion(input.y, temporaryEntityVariable(1));
  const stackPtrPlugin = stackPtr;


  _addComment("Background Text");
    
  _rpn() //
    .refVariable(xVar)
    .int16(1)
    .operator('.ADD')
    .refVariable(yVar)
    .stop();
    
  _addCmd(`VM_SWITCH_TEXT_LAYER .TEXT_LAYER_BKG`);

  _loadText(2);
  _addCmd(`.dw .ARG1, .ARG0`);
  
  _addCmd(`.asciz "\\003%c%c${input.text}"`);  
  
  _displayText();

  _overlayWait(false, [".UI_WAIT_TEXT"]);

  _addNL();

  appendRaw(`VM_SWITCH_TEXT_LAYER .TEXT_LAYER_WIN`);

  _stackPop(2);
  _assertStackNeutral(stackPtrPlugin);
};

module.exports = {
  id,
  name,
  groups,
  fields,
  compile,
};
