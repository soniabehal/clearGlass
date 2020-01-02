module.exports = {
  getQueryStrings(queryParams) {
    const { clients, projects, cost_types } = queryParams;
    return `
      select cl.name as client_name,t2.* from clients cl
      inner join
      (select p.title as project_title,p.client_id,t1.* from projects p
      inner join 
      (select c.cost_type_id as cost_id,c.amount,c.project_id,ct.name AS cost_name,ct.parent_cost_type_id 
        from costs c inner join cost_types ct on c.cost_type_id=ct.id ${cost_types ? 'where c.cost_type_id in (' + cost_types + ')' : ''} ) as t1
      on p.id= t1.project_id ${projects ? 'where p.id in (' + projects + ')' : ''}
      ) as t2
      on cl.id=t2.client_id ${clients ? 'where cl.id in (' + clients + ')' : ''};
      `;
  }
}
