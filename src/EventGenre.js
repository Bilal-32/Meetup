import React, { useEffect, useState } from "react";
import {PieChart, Pie, ResponsiveContainer, Tooltip} from "recharts";

const EventGenre = ({ events }) => {
  const [data, setData] = useState([]);

  const getData = () => {
    const genres = ["React", "JavaScript", "Node", "jQuery", "AngularJS"];

    const data = genres.map((genre) => {
      let value = null;
      try{
        value = events.filter((event) =>
          event.summary.replace(".js", "").split(" ").includes(genre)
        ).length;
      }catch(e){ }
      return {
        name: genre,
        value: value,
      };
    });
    return data;
  };

  useEffect(() => {
    setData(() => getData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  return (
    <ResponsiveContainer  width={700}>
      <PieChart width={400}  id="pie1">
        <Pie
          id="pie"
          width={600}
          height={400}
          data={data}
          isAnimationActive={false}
          labelLine={true}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default EventGenre;
