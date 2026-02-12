console.log('Test: importing express...');
import('express').then(() => {
    console.log('Express imported successfully');
}).catch(err => {
    console.error('Error importing express:', err);
});
