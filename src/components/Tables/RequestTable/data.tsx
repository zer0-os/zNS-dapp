/* eslint-disable no-loop-func */
import {
	DomainRequest,
	DomainRequestAndContents,
	DomainRequestContents,
} from 'lib/types';

// @TODO this function isn't great - rewrite
export const getRequestData = (requests: DomainRequest[]) => {
	return new Promise((resolve, reject) => {
		const requestsToFetch = requests.filter((d: any) => d.requestUri);
		const loadedRequests: DomainRequestAndContents[] = [];
		var counted = 0;

		for (var i = 0; i < requestsToFetch.length; i++) {
			const request = requestsToFetch[i];
			fetch(request.requestUri).then(async (res) => {
				try {
					const contents: DomainRequestContents = await res.json();
					const requestData: DomainRequestAndContents = {
						contents,
						request,
					};

					loadedRequests.push(requestData);
				} catch (e) {
					console.error(
						`Failed to retrieve request data of ${request.id} (${request.requestUri})`,
					);
				}

				if (++counted === requestsToFetch.length) {
					resolve(loadedRequests);
				} else if (counted > requestsToFetch.length) {
					reject();
				}
			});
		}

		return;
	});
};
