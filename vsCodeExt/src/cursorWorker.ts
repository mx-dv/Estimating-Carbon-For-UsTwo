import axios from 'axios';

const fetchData = async () => {
  try {
    const response = await axios.get('https://cursor.com/api/dashboard/get-filtered-usage-events');
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

fetchData();