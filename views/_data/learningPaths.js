import ky from 'ky';

export default async function () {
	return await ky('http://localhost:4200/api/v1/lessons').json();
}

