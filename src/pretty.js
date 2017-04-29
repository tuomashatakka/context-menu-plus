const expression = {
  // init: new RegExp(`(?=(?:[\b\n\t;]+)?(✖|︎⌦|▹|▸|►|▶|︎‣|➤|→|⇢|⧁|●|◉|Ω|⌕|~|∿|∫|⩭|µ))`  , 'igm'),
  init: /(?=(?:[\b\n\t;]+)?(✖|︎⌦|▹|▸|►|▶|︎‣|➤|→|⇢|⧁|●|◉|Ω|⌕|~|∿|∫|⩭|µ))/igm,
  exec: /[ ;]*?\1\s*(((?!\1).)+?)\s*(?:\1)(?:[\b\n\t;]+)?/igm,
}

const pretty = {

  expression,

  execute: function (expr) {
    try {
      return eval(expr)
    }
    catch(err) {
      console.warn("Error while executing an expression:\n  > ", expr, "-->", "threw an error:", err)
      return err.message
    }
  },

  resolve: function (ch) {
    let clause = new RegExp([pretty.expression.init, pretty.expression.exec].join(''), 'igm')
    console.info("Resolved from", pretty.type(ch), "into\n -->", ch.replace(clause, (match, expr) => expr))
    return ch.replace(clause, (match, expr) => expr)
  },

  print: function (...parts) {
    let result = parts
      .map(c => pretty.resolve(c))
      .map(c => pretty.execute(c))
    console.info(this, parts, result)
    console.log(...result)
    return result
  },

  type: v => `<${v.constructor.name}>${v.name}`
}

export default pretty
