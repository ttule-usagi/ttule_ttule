export interface GooglePlaceDetail {
  displayName?: { text: string; languageCode: string };
  googleMapsUri?: string;
  businessStatus?: string;
  primaryTypeDisplayName?: { text: string };
}

export interface GooglePlaceLocation {
  latitude: number;
  longitude: number;
}

export interface SelectedGooglePlace {
  id: string;
  displayName: { text: string; languageCode: string };
  formattedAddress: string;
  location: GooglePlaceLocation;
  additionalData?: GooglePlaceDetail;
}
