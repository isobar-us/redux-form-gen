import {
  evalCond,
  // evalCondValid,
  condDependentFields
} from '../src/conditionalUtils';

describe('evalCond()', () => {
  describe('shallow/deep', () => {
    it('should access deep when reduxFormDeep option is true', () => {
      expect(
        evalCond({
          cond: {questionId: 'foo', equals: 'bar'},
          data: {foo: {input: {value: 'bar'}}},
          reduxFormDeep: true
        })
      ).toBe(true);
    });
    it('should access shallow when reduxFormDeep option is false', () => {
      expect(
        evalCond({
          cond: {questionId: 'foo', equals: 'bar'},
          data: {foo: 'bar'},
          reduxFormDeep: false
        })
      ).toBe(true);
    });
    it('should access shallow when no options passed', () => {
      expect(
        evalCond({
          cond: {questionId: 'foo', equals: 'bar'},
          data: {foo: 'bar'}
        })
      ).toBe(true);
    });
  });

  describe('default cond (filled)', () => {
    it('should return true if remote questionId filled out', () => {
      expect(
        evalCond({
          cond: {questionId: 'foo'},
          data: {foo: 'bar'}
        })
      ).toBe(true);
    });

    it('should return false if remote questionId is empty', () => {
      expect(
        evalCond({
          cond: {questionId: 'foo'},
          data: {foo: ''}
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo'},
          data: {foo: null}
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo'},
          data: {}
        })
      ).toBe(false);
    });
  });

  describe('filled', () => {
    it('should return true if remote questionId filled out', () => {
      expect(
        evalCond({
          cond: {questionId: 'foo', filled: true},
          data: {foo: 'bar'}
        })
      ).toBe(true);
    });

    it('should return false if remote questionId is empty', () => {
      expect(
        evalCond({
          cond: {questionId: 'foo', filled: true},
          data: {foo: ''}
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo', filled: true},
          data: {foo: null}
        })
      ).toBe(false);

      expect(
        evalCond({
          cond: {questionId: 'foo', filled: true},
          data: {}
        })
      ).toBe(false);
    });

    it('should return true if remote questionId is empty', () => {
      expect(
        evalCond({
          cond: {questionId: 'foo', filled: false},
          data: {foo: ''}
        })
      ).toBe(true);

      expect(
        evalCond({
          cond: {questionId: 'foo', filled: false},
          data: {foo: null}
        })
      ).toBe(true);

      expect(
        evalCond({
          cond: {questionId: 'foo', filled: false},
          data: {}
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
          valueKey: 'foo'
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
          data: {} // nil as 0
        })
      ).toBe(true);
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
          data: {} // nil as 0
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
          data: {} // nil as 0
        })
      ).toBe(true);
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
          data: {} // nil as 0
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
          data: {} // nil as 0
        })
      ).toBe(true);
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
          data: {} // nil as 0
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
          data: {} // nil as 0
        })
      ).toBe(true);
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
          data: {} // nil as 0
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
