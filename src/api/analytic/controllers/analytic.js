module.exports = {
  async getUserAnalytic() {
    return [];
  },
};

function getZeroDate(dateStr) {
  return dateStr.split("T")[0] + "T00:00:00.000Z";
}

module.exports = {
  async getUserAnalytic(ctx) {
    const id = ctx.params.id;
    if (!id) return;

    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        where: { id },
        populate: {
          role: true,
          workRequests: true,
        },
      });

    let totalRequests = 0;
    let averageRequestDuration = 0;
    const graphData = {};

    let totalTime = 0;
    let completedRequests = 0;

    for (const request of user.workRequests) {
      if (request.status !== "completed") {
        continue; // Пропустить запросы с другим статусом
      }

      const date = getZeroDate(request.createdAt);
      if (!graphData[date]) {
        graphData[date] = [0, []];
      }

      graphData[date][0]++;
      let time =
        new Date(request.updatedAt).getTime() -
        new Date(request.createdAt).getTime();
      time = time / 1000 / 60;
      totalTime += time;
      graphData[date][1] = totalTime / graphData[date][0];

      totalRequests++;
      averageRequestDuration += time;
      completedRequests++;
    }

    // Проверка, чтобы избежать деления на 0
    if (completedRequests > 0) {
      averageRequestDuration /= completedRequests;
    }

    return {
      data: {
        analytic: {
          totalRequests,
          averageRequestDuration,
          graphData,
        },
      },
    };
  },
};
