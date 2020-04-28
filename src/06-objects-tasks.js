/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => width * height;
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 * https://www.codewars.com/kata/css-selectors-builder/train/javascript
 */
class CssSelector {
  constructor() {
    this.selector = '';
    this.type = 0;
    this.uniqueError = 'Element, id and pseudo-element should not occur more then one time inside the selector'; // eslint-disable-line
    this.orderError = // eslint-disable-line
      'Selector parts should be arranged in the following order: ' + // eslint-disable-line
      'element, id, class, attribute, pseudo-class, pseudo-element'; // eslint-disable-line
  }

  element(value) {
    this.checkType(1);
    this.selector += value;
    return this;
  }

  id(value) {
    this.checkType(2);
    this.selector += `#${value}`;
    return this;
  }

  class(value) {
    this.checkType(3);
    this.selector += `.${value}`;
    return this;
  }

  attr(value) {
    this.checkType(4);
    this.selector += `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    this.checkType(5);
    this.selector += `:${value}`;
    return this;
  }

  pseudoElement(value) {
    this.checkType(6);
    this.selector += `::${value}`;
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.selector = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return this;
  }

  stringify() {
    return this.selector;
  }

  checkType(type) {
    if (type < this.type) throw this.orderError;
    if (type === this.type && [1, 2, 6].includes(type)) throw this.uniqueError;
    this.type = type;
  }
}

const cssSelectorBuilder = {
  // prettier-ignore
  element: (value) => new CssSelector().element(value),
  // prettier-ignore
  id: (value) => new CssSelector().id(value),
  // prettier-ignore
  class: (value) => new CssSelector().class(value),
  // prettier-ignore
  attr: (value) => new CssSelector().attr(value),
  // prettier-ignore
  pseudoClass: (value) => new CssSelector().pseudoClass(value),
  // prettier-ignore
  pseudoElement: (value) => new CssSelector().pseudoElement(value),
  combine: (s1, c, s2) => new CssSelector().combine(s1, c, s2),
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
