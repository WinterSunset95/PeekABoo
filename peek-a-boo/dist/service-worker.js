const SERVER = "http://localhost:3000";
self.addEventListener('fetch', (event) => {
	const originalRequest = event.requst;

	const targetUrl = originalRequest.url

	const proxyUrl = `${SERVER}/proxy?url=${encodeURIComponent(targetUrl)}`
	console.log(proxyUrl)

	event.respondWith(
		fetch(proxyUrl, {
			method: originalRequest.method,
			headers: originalRequest.headers,
			body: originalRequest.body,
			credentials: 'same-origin'
		}).then((response) => {
			return response;
		}).catch((error) => {
			return error
		})
	)
})
