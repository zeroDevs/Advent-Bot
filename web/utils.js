// async/await error catcher
const catchAsyncErrors = fn => (
  (req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) {
      routePromise.catch(err => console.error(err));
    }
  }
);

exports.catchAsync = catchAsyncErrors
