export default function <T>(response: RESPONSE<T> | CONFIRM): response is SUCCESSRESPONSE<T> | CONFIRMRESPONSE {
	return response.success
}