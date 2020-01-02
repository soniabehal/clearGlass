module.exports = {
  aggregateResults(data) {
    const costAgg = data.filter(dt => !dt.parent_cost_type_id); //parent aggregation on basis of cost
    for (let i = 0; i < costAgg.length; i++) {
      const cost_id = costAgg[i].cost_id;
      const project_id = costAgg[i].project_id;
      costAgg[i].breakdown = data.filter(dt => dt.parent_cost_type_id == cost_id && dt.project_id == project_id)
        .map(agg => ({
          id: agg.cost_id,
          name: agg.cost_name,      //group and map of cost aggregation
          amount: agg.amount,
          breakdown: data.filter(dt => dt.parent_cost_type_id == agg.cost_id && dt.project_id == project_id)
            .map(ag => ({
              id: ag.cost_id,
              name: ag.cost_name,
              amount: ag.amount,
              breakdown: []
            }))
        }));
    }
    const projectAgg = [];
    for (let i = 0; i < costAgg.length; i++) {
      const cost = costAgg[i];
      const index = projectAgg.findIndex(pa => pa.id == cost.project_id && pa.client_id == cost.client_id);
      if (index == -1) {
        projectAgg.push({
          client_name: cost.client_name,
          client_id: cost.client_id,
          id: cost.project_id,
          name: cost.project_title,
          amount: cost.amount,   //aggregation on basis of project
          breakdown: [
            {
              id: cost.cost_id,
              name: cost.cost_name,
              amount: cost.amount,
              breakdown: cost.breakdown,
            }
          ]
        })
      }
      else {
        projectAgg[index].amount += cost.amount;
        projectAgg[index].breakdown.push({
          id: cost.cost_id,
          name: cost.cost_name,
          amount: cost.amount,
          breakdown: cost.breakdown,
        });
      }
    }

    const clientAgg = [];
    for (let i = 0; i < projectAgg.length; i++) {
      const project = projectAgg[i];
      const index = clientAgg.findIndex(ca => ca.id == project.client_id);
      if (index == -1) {
        clientAgg.push({
          id: project.client_id,
          name: project.client_name,
          amount: project.amount,
          breakdown: [
            {
              id: project.id,
              name: project.name,
              amount: project.amount,
              breakdown: project.breakdown,   //aggregation on basis of client
            }
          ]
        })
      }
      else {
        clientAgg[index].amount += project.amount;
        clientAgg[index].breakdown.push({
          id: project.id,
          name: project.name,
          amount: project.amount,
          breakdown: project.breakdown,
        });
      }
    }
    return clientAgg;
  }
}