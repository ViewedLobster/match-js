function Left (u) {
  this.u = u
  this.flatMap = function (fn) {
    return Left(this.u)
  }
  this.isLeft = function () {
    return true
  }
  this.isRight = function () {
    return false
  }
  this.left = function () {
    return this.u
  }
}

function Right (v) {
  this.v = v
  this.flatMap = function (fn) {
    return fn(this.v)
  }
  this.isLeft = function () {
    return false
  }
  this.isRight = function () {
    return true
  }
  this.right = function() {
    return this.v
  }
}

const onCurry = pred => fn => e => {
  return e.flatMap(v => {
    if (pred(v)) {
      return Left(fn(v))
    } else {
      return Right(v)
    }
  })
}

const otherwiseCurry = fn => e => {
  return e.flatMap(v => Left(fn(v)))
}

let matchingfunction = fp.compose(otherwise(() => 1), on(x => x < 40)(() => 0))

const on = function (pred, fn) {
  let f = fp.compose(e =>
    e.flatMap(
      x => {
        if (pred(x)) {
          return Left(fn(x))
        } else {
          return Right(x)
        }
      }
    ),
    this
  )
  f.on = on.bind(f)
  f.otherwise = otherwise.bind(f)
  return f
}

const otherwise = function (fn) {
  let f = fp.compose(e => {
    if (e.isRight()) {
      return fn(e.right())
    } else {
      return e.left()
    }
  }
    ,
    this
  )
  // does not create methods on and otherwise since this should be the last statement
  return f
}

const match = {
  on: (pred, fn) => {
    // return function which creates an either and then runs the pred fn thingy, endow the function with the on and otherwise methods
    let f = function (matchee) {
      return Right(matchee).flatMap(x => {
        if (pred(x)) {
          return Left(fn(x))
        } else {
          return Right(x)
        }
      })
    }
    f.on = on.bind(f)
    f.otherwise = otherwise.bind(f)
    return f
  },
  otherwise: fn => {
    let f = function (matchee) {
      return fn(matchee)
    }
    return f
  }
  // should return a function which takes an object to match. The function object should have two methods, on and otherwise.
  // both should return a composed version of the function itself, and the function specified by arguments to on and otherwise
}

