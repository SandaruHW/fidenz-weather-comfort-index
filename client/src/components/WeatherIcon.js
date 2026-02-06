import {
  SunIcon,
  CloudIcon,
  CloudArrowDownIcon,
  CloudArrowUpIcon,
} from '@heroicons/react/24/outline';

export default function WeatherIcon({ description, className = "w-12 h-12 mx-auto" }) {
  const lower = (description || '').toLowerCase();

  if (lower.includes('clear') || lower.includes('sun')) {
    return <SunIcon className={`${className} text-yellow-500`} />;
  }
  if (lower.includes('cloud') && !lower.includes('rain')) {
    return <CloudIcon className={`${className} text-gray-500 dark:text-gray-400`} />;
  }
  if (lower.includes('rain') || lower.includes('shower')) {
    return <CloudArrowDownIcon className={`${className} text-blue-500`} />;
  }
  if (lower.includes('partly') || lower.includes('few clouds')) {
    return <CloudArrowUpIcon className={`${className} text-yellow-600`} />;
  }
  return <CloudIcon className={`${className} text-gray-400 dark:text-gray-500`} />;
}