const calculateStatistics = (villages) => {
  const initialStatistics = {
    totalPopulation: 0,
    totalLandArea: 0,
    totalVillages: villages.length,
    totalUrbanAreas: 0,
    ageDistribution: {
      age_0_18: 0,
      age_19_35: 0,
      age_36_50: 0,
      age_51_65: 0,
      age_65_plus: 0,
    },
    genderRatio: { male: 0, female: 0 },
    populationDistribution: [],
  };

  return villages.reduce((acc, { demographic, landArea, name, categories }) => {
    if (!demographic) 
      return acc;

    const { populationSize, ageDistribution, genderRatio } = demographic;
    acc.totalPopulation += populationSize ?? 0;
    acc.totalLandArea += landArea ?? 0;
    
    if (categories?.some(category => category.toLowerCase() === 'urban')) {
      acc.totalUrbanAreas += 1;
    }

    if (ageDistribution) {
      Object.keys(ageDistribution).forEach(ageGroup => {
        acc.ageDistribution[ageGroup] += ageDistribution[ageGroup] ?? 0;
      });
    }

    if (genderRatio) {
      Object.keys(genderRatio).forEach(gender => {
        acc.genderRatio[gender] += genderRatio[gender] ?? 0;
      });
    }

    acc.populationDistribution.push({
      name,
      population: populationSize ?? 0,
    });

    return acc;
  }, initialStatistics);
};

module.exports = calculateStatistics;
