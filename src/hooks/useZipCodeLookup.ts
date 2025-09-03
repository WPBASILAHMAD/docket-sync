import { useState, useCallback, useRef } from 'react';

interface ZipCodeResult {
  city: string;
  country: string;
  success: boolean;
  error?: string;
}

export const useZipCodeLookup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const lookupZipCode = useCallback(async (zipCode: string, currentCountry?: string): Promise<ZipCodeResult> => {
    if (!zipCode || zipCode.trim().length < 3) {
      return { city: '', country: '', success: false, error: 'ZIP code too short' };
    }

    setIsLoading(true);
    try {
      // Clean zip code (remove spaces and special characters for API call)
      const cleanZip = zipCode.replace(/[^\w]/g, '');
      
      // Try Zippopotam.us API first (free, no key required)
      const response = await fetch(`https://api.zippopotam.us/${cleanZip}`, {
        method: 'GET',
      });

      if (!response.ok) {
        // If direct lookup fails, try with country code if provided
        if (currentCountry) {
          const countryCode = getCountryCode(currentCountry);
          if (countryCode) {
            const countryResponse = await fetch(`https://api.zippopotam.us/${countryCode}/${cleanZip}`);
            if (countryResponse.ok) {
              const data = await countryResponse.json();
              return {
                city: data.places?.[0]?.['place name'] || '',
                country: data.country || currentCountry,
                success: true
              };
            }
          }
        }
        throw new Error('ZIP code not found');
      }

      const data = await response.json();
      return {
        city: data.places?.[0]?.['place name'] || '',
        country: data.country || '',
        success: true
      };
    } catch (error) {
      return {
        city: '',
        country: '',
        success: false,
        error: error instanceof Error ? error.message : 'Failed to lookup ZIP code'
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedLookup = useCallback((
    zipCode: string, 
    currentCountry: string | undefined, 
    onResult: (result: ZipCodeResult) => void,
    delay: number = 800
  ) => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      if (zipCode.trim().length >= 3) {
        setIsLoading(true);
        const result = await lookupZipCode(zipCode, currentCountry);
        onResult(result);
        setIsLoading(false);
      }
    }, delay);
  }, [lookupZipCode]);

  return { lookupZipCode, debouncedLookup, isLoading };
};

// Helper function to get country codes for API
const getCountryCode = (countryName: string): string | null => {
  const countryCodes: { [key: string]: string } = {
    'United States': 'us',
    'Canada': 'ca',
    'United Kingdom': 'gb',
    'Germany': 'de',
    'France': 'fr',
    'Italy': 'it',
    'Spain': 'es',
    'Australia': 'au',
    'Japan': 'jp',
    'Netherlands': 'nl',
    'Sweden': 'se',
    'Switzerland': 'ch',
    'Austria': 'at',
    'Belgium': 'be',
    'Denmark': 'dk',
    'Norway': 'no',
    'Finland': 'fi',
    'Pakistan': 'pk',
    'India': 'in',
    'China': 'cn',
    'Brazil': 'br',
    'Mexico': 'mx',
    'South Korea': 'kr',
    'Singapore': 'sg',
    'New Zealand': 'nz',
    'Ireland': 'ie',
    'Portugal': 'pt',
    'Poland': 'pl',
    'Czech Republic': 'cz',
    'Hungary': 'hu',
    'Greece': 'gr',
    'Turkey': 'tr',
    'Russia': 'ru',
    'South Africa': 'za',
    'Egypt': 'eg',
    'Israel': 'il',
    'Saudi Arabia': 'sa',
    'United Arab Emirates': 'ae',
    'Thailand': 'th',
    'Malaysia': 'my',
    'Indonesia': 'id',
    'Philippines': 'ph',
    'Vietnam': 'vn'
  };
  
  return countryCodes[countryName] || null;
};