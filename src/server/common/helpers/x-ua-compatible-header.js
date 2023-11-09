/**
 * Provide the X-UA-Compatible response header for the application. This will force the portal that is on the
 * intranet on Edge on DEFRA machines to be shown in Edge mode. Without this the portal is shown in IE11
 * compatability mode
 *
 * @param request
 * @param h
 * @returns {*}
 */
function xUaCompatibleHeader(request, h) {
  request.response.header('X-UA-Compatible', 'IE=Edge, chrome=1')

  return h.continue
}

export { xUaCompatibleHeader }
