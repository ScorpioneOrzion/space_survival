export default function (response: RESPONSE): response is SUCCESSRESPONSE {
	return response.success
}