export interface GooglePlaceDetail {
  displayName?: { text: string; languageCode: string };
  googleMapsUri?: string;
  businessStatus?: string;
  formattedAddress?: string;
  primaryTypeDisplayName?: { text: string };
}

export interface GooglePlaceLocation {
  latitude: number;
  longitude: number;
}

export interface SelectedGooglePlace {
  id: string;
  displayName: { text: string; languageCode: string };
  shortFormattedAddress?: string;
  location: GooglePlaceLocation;
  additionalData?: GooglePlaceDetail;
}
