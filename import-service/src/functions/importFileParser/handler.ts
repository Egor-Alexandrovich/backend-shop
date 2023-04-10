export const importFileParser = async (event) => {
  console.log('Event from S3', event)
  console.log('file Was created')
  return {
    statusCode: 202
  };
};


