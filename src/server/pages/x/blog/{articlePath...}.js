export async function GET(request, h) {
  const articlePath = request.params.articlePath
  return 'Article Path: ' + articlePath
}
