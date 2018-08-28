import {evalCond, evalCondValid, condDependentFields} from '../src/conditionalUtils';

import {buildLookupTable} from '../src/utils';

let consoleErrorSpy;
let consoleWarnSpy;
const startErrorSupression = () => {
  consoleErrorSpy = jest.spyOn(console, 'error');
  consoleErrorSpy.mockImplementation(() => {}); // suppress error log
  consoleWarnSpy = jest.spyOn(console, 'warn');
  consoleWarnSpy.mockImplementation(() => {}); // suppress warn log
};

const stopErrorSuppression = () => {
  consoleErrorSpy.mockReset();
  consoleErrorSpy.mockRestore();
  consoleWarnSpy.mockReset();
  consoleWarnSpy.mockRestore();
};

describe('evalCond()', () => {
  const fooFields = [
    {
      type: 'text',
      questionId: 'foo'
    }
  ];

  const fooLookupTable = buildLookupTable({
    fields: fooFields
    // customFieldTypes
  });

  describe('default cond (filled)', () => {
    const lookupTable = fooLookupTable;
    it('should return true if remote questionId filled out', () => {
      expect(
        evalCond({
          cond: {questionId: 'foo'},
          data: {foo: 'bar'},
          lookupTable
        })
      ).toBe(true);
    });

    it('should return false if remote questionId is empty', () => {
      expect(
        evalCond({
          cond: {questionId: 'foo'},
          data: {foo: ''},
          lookupTable
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo'},
          data: {foo: null},
          lookupTable
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo'},
          data: {},
          lookupTable
        })
      ).toBe(false);
    });
  });

  describe('filled', () => {
    const lookupTable = fooLookupTable;
    it('should return true if remote questionId filled out', () => {
      expect(
        evalCond({
          cond: {questionId: 'foo', filled: true},
          data: {foo: 'bar'},
          lookupTable
        })
      ).toBe(true);
    });

    it('should return false if remote questionId is empty', () => {
      expect(
        evalCond({
          cond: {questionId: 'foo', filled: true},
          data: {foo: ''},
          lookupTable
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo', filled: true},
          data: {foo: null},
          lookupTable
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo', filled: true},
          data: {},
          lookupTable
        })
      ).toBe(false);
    });

    it('should return true if remote questionId is empty', () => {
      expect(
        evalCond({
          cond: {questionId: 'foo', filled: false},
          data: {foo: ''},
          lookupTable
        })
      ).toBe(true);

      expect(
        evalCond({
          cond: {questionId: 'foo', filled: false},
          data: {foo: null},
          lookupTable
        })
      ).toBe(true);

      expect(
        evalCond({
          cond: {questionId: 'foo', filled: false},
          data: {},
          lookupTable
        })
      ).toBe(true);
    });

    // it('should return true if remote questionId is empty', () => {
    //   expect(evalCond({
    //     cond: {equals: 'foo', filled: 'other'},
    //     data: {foo: ''}
    //   })).toBe(true);
    // });
  });

  describe('valueKey', () => {
    const lookupTable = fooLookupTable;
    it('should return true if parent filled out', () => {
      expect(
        evalCond({
          cond: {equals: 'bar'},
          data: {foo: 'bar'},
          valueKey: 'foo'
        })
      ).toBe(true);
    });

    it('should return false if parent is empty', () => {
      expect(
        evalCond({
          cond: {questionId: 'foo'},
          data: {foo: ''},
          valueKey: 'foo',
          lookupTable
        })
      ).toBe(false);
    });
  });

  describe('not', () => {
    it('should return false if foo === "bar"', () => {
      expect(
        evalCond({
          cond: {not: {questionId: 'foo', equals: 'bar'}},
          data: {foo: 'bar'}
        })
      ).toBe(false);
    });

    it('should return true if foo !== "bar"', () => {
      expect(
        evalCond({
          cond: {not: {questionId: 'foo', equals: 'bar'}},
          data: {foo: 'baz'}
        })
      ).toBe(true);
    });
  });

  describe('includes', () => {
    it('should return true if foo includes "bar"', () => {
      expect(
        evalCond({
          cond: {questionId: 'foo', includes: 'bar'},
          data: {foo: ['bar']}
        })
      ).toBe(true);
    });

    it('should return false if foo does not include "bar"', () => {
      expect(
        evalCond({
          cond: {questionId: 'foo', includes: 'bar'},
          data: {foo: ['baz']}
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo', includes: 'bar'},
          data: {}
        })
      ).toBe(false);
    });
  });

  describe('lessThan', () => {
    it('should return true if foo less than 5', () => {
      expect(
        evalCond({
          cond: {questionId: 'foo', lessThan: 5},
          data: {foo: 2}
        })
      ).toBe(true);

      expect(
        evalCond({
          cond: {questionId: 'foo', lessThan: 5},
          data: {foo: '2'}
        })
      ).toBe(true);

      expect(
        evalCond({
          cond: {questionId: 'foo', lessThan: 5},
          data: {} // nil will result in false
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo', lessThan: 5},
          data: {foo: ''} // empty string will result in false
        })
      ).toBe(false);
    });

    it('should return false if foo is not less than 5', () => {
      expect(
        evalCond({
          cond: {questionId: 'foo', lessThan: 5},
          data: {foo: 5}
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo', lessThan: 5},
          data: {foo: '5'}
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo', lessThan: -5},
          data: {} // nil will result in false
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo', lessThan: -5},
          data: {foo: ''} // empty string will result in false
        })
      ).toBe(false);
    });
  });

  describe('greaterThan', () => {
    it('should return true if foo greater than 5', () => {
      expect(
        evalCond({
          cond: {questionId: 'foo', greaterThan: 5},
          data: {foo: 7}
        })
      ).toBe(true);

      expect(
        evalCond({
          cond: {questionId: 'foo', greaterThan: 5},
          data: {foo: '7'}
        })
      ).toBe(true);

      expect(
        evalCond({
          cond: {questionId: 'foo', greaterThan: -5},
          data: {} // nil will result in false
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo', greaterThan: -5},
          data: {foo: ''} // empty string will result in false
        })
      ).toBe(false);
    });

    it('should return false if foo is not greater than 5', () => {
      expect(
        evalCond({
          cond: {questionId: 'foo', greaterThan: 5},
          data: {foo: 5}
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo', greaterThan: 5},
          data: {foo: '5'}
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo', greaterThan: 5},
          data: {} // nil will result in false
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo', greaterThan: 5},
          data: {foo: ''} // empty string will result in false
        })
      ).toBe(false);
    });
  });

  describe('lessThanEqual', () => {
    it('should return true if foo less than 5', () => {
      expect(
        evalCond({
          cond: {questionId: 'foo', lessThanEqual: 5},
          data: {foo: 2}
        })
      ).toBe(true);

      expect(
        evalCond({
          cond: {questionId: 'foo', lessThanEqual: 5},
          data: {foo: '2'}
        })
      ).toBe(true);

      expect(
        evalCond({
          cond: {questionId: 'foo', lessThanEqual: 5},
          data: {} // nil will result in false
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo', lessThanEqual: 5},
          data: {foo: ''} // empty string will result in false
        })
      ).toBe(false);
    });

    it('should return false if foo is not less than 5', () => {
      expect(
        evalCond({
          cond: {questionId: 'foo', lessThanEqual: 5},
          data: {foo: 6}
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo', lessThanEqual: 5},
          data: {foo: '6'}
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo', lessThanEqual: -5},
          data: {} // nil will result in false
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo', lessThanEqual: -5},
          data: {foo: ''} // empty string will result in false
        })
      ).toBe(false);
    });
  });

  describe('greaterThanEqual', () => {
    it('should return true if foo greater than 5', () => {
      expect(
        evalCond({
          cond: {questionId: 'foo', greaterThanEqual: 5},
          data: {foo: 7}
        })
      ).toBe(true);

      expect(
        evalCond({
          cond: {questionId: 'foo', greaterThanEqual: 5},
          data: {foo: 5}
        })
      ).toBe(true);

      expect(
        evalCond({
          cond: {questionId: 'foo', greaterThanEqual: 5},
          data: {foo: '7'}
        })
      ).toBe(true);

      expect(
        evalCond({
          cond: {questionId: 'foo', greaterThanEqual: 5},
          data: {foo: '5'}
        })
      ).toBe(true);

      expect(
        evalCond({
          cond: {questionId: 'foo', greaterThanEqual: -5},
          data: {} // nil will result in false
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo', greaterThanEqual: -5},
          data: {foo: ''} // empty string will result in false
        })
      ).toBe(false);
    });

    it('should return false if foo is not greater than 5', () => {
      expect(
        evalCond({
          cond: {questionId: 'foo', greaterThanEqual: 5},
          data: {foo: 4}
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo', greaterThanEqual: 5},
          data: {foo: '4'}
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo', greaterThanEqual: 5},
          data: {} // nil will result in false
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo', greaterThanEqual: 5},
          data: {foo: ''} // empty string will result in false
        })
      ).toBe(false);
    });
  });

  describe('and', () => {
    it('should return true if both conds are true', () => {
      expect(
        evalCond({
          cond: {
            and: [{questionId: 'foo', gt: 2}, {questionId: 'foo', lt: 7}]
          },
          data: {foo: 5}
        })
      ).toBe(true);
    });

    it('should return false if at least one cond is false', () => {
      expect(
        evalCond({
          cond: {
            and: [{questionId: 'foo', gt: 2}, {questionId: 'foo', lt: 4}]
          },
          data: {foo: 5}
        })
      ).toBe(false);
    });
  });

  describe('or', () => {
    it('should return true if at least one cond is true', () => {
      expect(
        evalCond({
          cond: {
            or: [{questionId: 'foo', gt: 2}, {questionId: 'foo', lt: 4}]
          },
          data: {foo: 5}
        })
      ).toBe(true);
    });

    it('should return false if both conds are false', () => {
      expect(
        evalCond({
          cond: {
            or: [{questionId: 'foo', equals: 6}, {questionId: 'foo', lt: 4}]
          },
          data: {foo: 5}
        })
      ).toBe(false);
    });
  });

  describe('length', () => {
    it('should return true if at length = 3', () => {
      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            length: 3
          },
          data: {foo: 'abc'}
        })
      ).toBe(true);
    });

    it('should return false if at length != 3', () => {
      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            length: 3
          },
          data: {}
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            length: 3
          },
          data: {foo: null}
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            length: 3
          },
          data: {foo: ''}
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            length: 3
          },
          data: {foo: 's'}
        })
      ).toBe(false);
    });
  });

  describe('minLength', () => {
    it('should return true if at length >= 3', () => {
      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            minLength: 3
          },
          data: {foo: 'abcdef'}
        })
      ).toBe(true);
    });

    it('should return false if at length < 3', () => {
      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            minLength: 3
          },
          data: {}
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            minLength: 3
          },
          data: {foo: null}
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            minLength: 3
          },
          data: {foo: ''}
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            minLength: 3
          },
          data: {foo: 'ab'}
        })
      ).toBe(false);
    });
  });

  describe('maxLength', () => {
    it('should return true if at length <= 3', () => {
      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            maxLength: 3
          },
          data: {}
        })
      ).toBe(true);

      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            maxLength: 3
          },
          data: {foo: null}
        })
      ).toBe(true);

      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            maxLength: 3
          },
          data: {foo: ''}
        })
      ).toBe(true);

      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            maxLength: 3
          },
          data: {foo: 'abc'}
        })
      ).toBe(true);
    });

    it('should return false if at length > 3', () => {
      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            maxLength: 3
          },
          data: {foo: 'abcdef'}
        })
      ).toBe(false);
    });
  });

  describe('email', () => {
    it('should return true if nil', () => {
      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            email: true
          },
          data: {}
        })
      ).toBe(true);

      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            regex: true
          },
          data: {foo: null}
        })
      ).toBe(true);
    });

    it('should return true if is an email', () => {
      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            email: true
          },
          data: {foo: 'foo@bar.com'}
        })
      ).toBe(true);
    });

    it('should return false if not an email.', () => {
      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            email: true
          },
          data: {foo: '123'}
        })
      ).toBe(false);
    });

    // TODO should act like filled (false evals the inverse of the operator)
    // it('should return inverse', () => {
    //   expect(
    //     evalCond({
    //       cond: {
    //         questionId: 'foo',
    //         email: false
    //       },
    //       data: {foo: 'foo@bar.com'}
    //     })
    //   ).toBe(false);
    //
    //   expect(
    //     evalCond({
    //       cond: {
    //         questionId: 'foo',
    //         email: false
    //       },
    //       data: {foo: '123'}
    //     })
    //   ).toBe(true);
    // });
  });

  describe('compare', () => {
    it('should compare one questionId to another questionId', () => {
      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            compare: {
              equals: 'bar'
            }
          },
          data: {
            foo: 50,
            bar: 50
          }
        })
      ).toBe(true);

      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            compare: {
              lessThan: 'bar'
            }
          },
          data: {
            foo: 50,
            bar: 50
          }
        })
      ).toBe(false);
    });

    it('should eval conds in the data', () => {
      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            compare: {
              cond: 'barCond'
            }
          },
          data: {
            foo: 50,
            barCond: {
              questionId: 'foo',
              equals: 50
            }
          }
        })
      ).toBe(true);
    });
  });

  describe('cond', () => {
    it('should return true if foo === "bar"', () => {
      expect(
        evalCond({
          cond: {cond: {questionId: 'foo', equals: 'bar'}},
          data: {foo: 'bar'}
        })
      ).toBe(true);
    });

    it('should return false if foo !== "bar"', () => {
      expect(
        evalCond({
          cond: {cond: {questionId: 'foo', equals: 'bar'}},
          data: {foo: 'baz'}
        })
      ).toBe(false);
    });
  });

  describe('customOperators', () => {
    it('should console.error if missing operator', () => {
      startErrorSupression();
      expect(
        evalCond({
          cond: {questionId: 'foo', barOp: true},
          data: {foo: 'bar'}
        })
      ).toBe(true);
      expect(consoleErrorSpy).toBeCalled();
      expect(consoleErrorSpy.mock.calls).toMatchSnapshot();
      stopErrorSuppression();
    });

    it('should use customOperators', () => {
      startErrorSupression();
      expect(
        evalCond({
          cond: {questionId: 'foo', barOp: true},
          data: {foo: 'baz'},
          customOperators: {
            barOp: ({value, param}) => (param ? value === 'bar' : true)
          }
        })
      ).toBe(false);
      expect(consoleErrorSpy).not.toBeCalled();
      stopErrorSuppression();
    });
  });

  describe('regex', () => {
    it('should return true if nil', () => {
      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            regex: '[a-z]+'
          },
          data: {}
        })
      ).toBe(true);

      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            regex: '[a-z]+'
          },
          data: {foo: null}
        })
      ).toBe(true);
    });

    it('should return true if matches', () => {
      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            regex: '[a-z]+'
          },
          data: {foo: 'abc'}
        })
      ).toBe(true);
    });

    it('should return false if not matches.', () => {
      expect(
        evalCond({
          cond: {
            questionId: 'foo',
            regex: '[a-z]+'
          },
          data: {foo: '123'}
        })
      ).toBe(false);
    });
  });
});

describe('condDependentFields()', () => {
  it('should pull all dependent questionIds', () => {
    const cond = {
      and: [
        {
          questionId: 'one'
        },
        {
          or: [
            {
              questionId: 'two'
            },
            {
              not: {
                questionId: 'three'
              }
            }
          ]
        }
      ]
    };

    const dependentFields = condDependentFields(cond);

    expect(dependentFields).toEqual(['one', 'two', 'three']);
  });
});

describe('evalCondValid()', () => {
  const customFieldTypes = {
    alwaysError: ({field}) => ({
      _genIsValid: () => false,
      name: field.questionId
    }),
    alwaysValid: ({field}) => ({
      _genIsValid: () => true,
      name: field.questionId
    })
  };
  it('should use getFieldErrors() when no operator is specified', () => {
    const fields = [
      {
        type: 'alwaysError',
        questionId: 'alwaysError'
      },
      {
        type: 'alwaysValid',
        questionId: 'alwaysValid'
      }
    ];

    const lookupTable = buildLookupTable({
      fields,
      customFieldTypes
    });

    const alwaysError = evalCondValid({
      cond: {
        questionId: 'alwaysError'
      },
      data: {
        alwaysError: 'foo'
      },
      customFieldTypes,
      lookupTable
    });

    const alwaysValid = evalCondValid({
      cond: {
        questionId: 'alwaysValid'
      },
      data: {
        alwaysValid: 'foo'
      },
      customFieldTypes,
      lookupTable
    });

    expect(alwaysError).toBe(false);
    expect(alwaysValid).toBe(true);
  });
});
