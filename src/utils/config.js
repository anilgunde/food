export const getConfig = key => {
  const envValue = `REACT_APP_${key}`;
  return process.env[envValue];
};
