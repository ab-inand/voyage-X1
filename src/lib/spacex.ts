export interface SpaceXLaunch {
  id: string;
  name: string;
  date_utc: string;
  success: boolean | null;
  links: {
    patch: {
      small: string;
    };
    webcast: string;
  };
  details: string;
  rocket: {
    name: string;
  };
}

export async function getNextLaunch(): Promise<SpaceXLaunch | null> {
  try {
    const response = await fetch('https://api.spacexdata.com/v5/launches/next');
    if (!response.ok) throw new Error('Failed to fetch launch data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching SpaceX launch data:', error);
    return null;
  }
}

export async function getUpcomingLaunches(): Promise<SpaceXLaunch[]> {
  try {
    const response = await fetch('https://api.spacexdata.com/v5/launches/upcoming');
    if (!response.ok) throw new Error('Failed to fetch launch data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching SpaceX launch data:', error);
    return [];
  }
}

export function formatLaunchDate(dateString: string): string {
  const launchDate = new Date(dateString);
  const now = new Date();
  const diff = launchDate.getTime() - now.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${days}d ${hours}h ${minutes}m`;
} 