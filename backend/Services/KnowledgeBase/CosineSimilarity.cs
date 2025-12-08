using System;
using System.Collections.Generic;
using System.Linq;

namespace backend.Services.KnowledgeBase
{
    public static class CosineSimilarity
    {
        public static float Calculate(IReadOnlyList<float> vectorA, IReadOnlyList<float> vectorB)
        {
            if (vectorA.Count == 0 || vectorB.Count == 0 || vectorA.Count != vectorB.Count)
            {
                return 0f;
            }

            var dotProduct = vectorA.Zip(vectorB, (a, b) => a * b).Sum();
            var magnitudeA = Math.Sqrt(vectorA.Sum(x => x * x));
            var magnitudeB = Math.Sqrt(vectorB.Sum(x => x * x));

            if (magnitudeA == 0 || magnitudeB == 0)
            {
                return 0f;
            }

            return (float)(dotProduct / (magnitudeA * magnitudeB));
        }
    }
}
