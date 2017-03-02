let request = (obj, cb) => {
  process.nextTick(() => {
    cb(request.__err, request.__resp, request.__body);
  })
}

request.__setErr = (err) => {
  request.__err = err;
}

request.__setResp = (resp) => {
  request.__resp = resp;
}

request.__setBody = (body) => {
  request.__body = body;
}

export default request;
