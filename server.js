import * as fs from "node:fs";
import * as http from "node:http";
import * as path from "node:path";

const PORT = 25566

const MIME_TYPES = {
    default: 'application/octet-stream',
    html: 'text/html; charset=UTF-8',
    js: 'text/javascript',
    css: 'text/css',
    png: 'image/png',
    jpg: 'image/jpeg',
    gif: 'image/gif',
    ico: 'image/x-icon',
    svg: 'image/svg+xml',
}

const PUBLIC_FOLDER_PATH = path.join(process.cwd(), "./public")

async function prepareFile(url) {
	const urlAsPath = decodeURI(url)
	const requestedPath = path.join(
		PUBLIC_FOLDER_PATH,
		urlAsPath,
		url.endsWith("/") ? "default.html" : "" // Redirect empty request to site 
	)
	const extension = path.extname(requestedPath).substring(1).toLowerCase()

	const pathIsAllowed = requestedPath.startsWith(PUBLIC_FOLDER_PATH) 
	const pathIsReadable = await fs.promises.access(requestedPath, fs.constants.R_OK).then(() => true).catch(() => false)
	
	const [found, pathToStream] = pathIsAllowed && pathIsReadable
		? [true, requestedPath]
		: [false, `${PUBLIC_FOLDER_PATH}/404.html`]
	
	return { extension, found, stream: fs.createReadStream(pathToStream) }
}

http
	.createServer(async (req, res) => {
		const file = await prepareFile(req.url)
		const statusCode = file.found ? 200 : 404
		const mimeType = MIME_TYPES[file.extension] || MIME_TYPES.default

		res.writeHead(statusCode, { "Content-Type": mimeType })
		file.stream.pipe(res)

		console.log(`${req.method} ${req.url} ${statusCode}`)
	})
	.listen(PORT)

console.log(`Server running at http://127.0.0.1:${PORT}/`)
