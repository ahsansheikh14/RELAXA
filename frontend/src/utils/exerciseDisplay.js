const exerciseImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB_kf2lpvT0db-z7g_4HtCasKJjjKQIK406J7SUlXQjRm8UDnN8pjsHhbGHD61hCfhMEYSnGg7y4pQ0od9MlZj8mXYdN6EndakdpIR8MuubLENXQg2RbzhfJ2kDdeMxQjMHWUmMe3ueADZ3lnxD0lfJ4Vk2j-DSDpuR4YiVJOcNUismNdvGWOZuF2DiSiUqa9Cb9NkcDohcrEhj5UbXawwklfkVLR4Kr9-I4yjCyxEqkQR2VkWnSRh258ai0hi18R5zZNO_AfQhX2tr',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCVhvIO8mycvhVcqWlBMu6y3ZzE6PAoxc-Pz_5UTfKQGybABScojbTgzT5FhGh817WwuR-VI1VGCtOlUFSIaAHBnyrQimtcvD6PlWVRW610DfS9DeHvtGW_-Ql6EyvoYx7Z7gIJiCG9GKLVaw9be5rnjNpcMkLru2ZnIiF-Zwm12-P-5P03sk178CiIh5_iWCz4O9yQki-uSc3kRh3geeHrukHFPqwwDtbsAWRKwhdDFAOG-bxQJcXV2q3c7D8aUYFnWwkmc4ItjJgj',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAeww9CREOi2wB0f-MJfMq-Rlb4woJ4S-n410GLxp7dbeuPOl-IwZUKHdo_Q44RtplTr4wHFnfnwcgUdE39Ed_0wUkssDCW7GcJ-Z6HJY-3_1eln4x4jPf8brOFCjIaWbc_5i_DGx2_gcvpOc2_gugA5oGkTW-lnXpuN_h6Iq6zHSSGOm1bErIjNzMVu_Y19E9g_Ndkw40NzEvY2beD8QubJo9sva8Hwq-EMQsy8NQUrZwDcwfcxNckA5DYXkieooIWgYs8Kd5sq8zN',
];

const iconByCategory = {
  meditation: 'self_improvement',
  breathing: 'air',
  sleep: 'bedtime',
  anxiety: 'air',
  work: 'laptop_mac',
  calm: 'spa',
  default: 'favorite',
};

const getExerciseVisual = (exercise, index = 0) => {
  const normalizedCategory = String(exercise?.category || '').trim().toLowerCase();

  return {
    image: exerciseImages[index % exerciseImages.length],
    icon: iconByCategory[normalizedCategory] || iconByCategory.default,
    mediaLabel:
      exercise?.mediaType === 'video' ? 'Video Session' : exercise?.mediaType === 'link' ? 'Guided Link' : 'Mindful Practice',
  };
};

export { getExerciseVisual };
