import api from '@shared/providers/HttpClientProvider/implementations/AxiosProvider';

interface IRequest {
  latitude: number;
  longitude: number;
}

interface IResponse {
  city: string | undefined;
  state: string | undefined;
}

export default async function getLocationInfo({
  latitude,
  longitude,
}: IRequest): Promise<IResponse> {
  try {
    const urlRequest = `${process.env.OPEN_CAGE_URL}`;

    const response = await api.get(urlRequest, {
      params: {
        key: process.env.OPEN_CAGE_KEY,
        q: `${latitude},${longitude}`,
        pretty: 1,
        no_annotations: 1,
      },
    });

    const { results } = response.data;

    const { state_code } = results[0].components;

    let { town } = results[0].components;

    if (!town) {
      town = results[0].components.city;
    }

    return {
      city: town,
      state: state_code,
    };
  } catch (err) {
    return {
      city: undefined,
      state: undefined,
    };
  }
}
