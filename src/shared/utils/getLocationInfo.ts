import api from './apiInstance';

interface IRequest {
  latitude: number;
  longitude: number;
}

interface IResponse {
  city: string | undefined;
  state: string | undefined;
}

const getLocationInfo = async ({
  latitude,
  longitude,
}: IRequest): Promise<IResponse> => {
  try {
    const response = await api.get(
      `${process.env.OPEN_CAGE_URL}key=${process.env.OPEN_CAGE_KEY}&q=${latitude},${longitude}&pretty=1&no_annotations=1`,
    );

    const { town, state } = response.data.results.components;

    console.log(town, state);

    return {
      city: town,
      state,
    };
  } catch (err) {
    return {
      city: undefined,
      state: undefined,
    };
  }
};

export default getLocationInfo;
