export interface GooglePlaceDetail {
  displayName?: { text: string; languageCode: string };
  googleMapsUri?: string;
  businessStatus?: string;
  formattedAddress?: string;
}

export interface SelectedGooglePlace {
  id: string;
  displayName: { text: string; languageCode: string };
  primaryTypeDisplayName?: { text: string };
  shortFormattedAddress?: string;
  additionalData?: GooglePlaceDetail;
}
