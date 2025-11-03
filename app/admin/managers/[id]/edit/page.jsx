import { connectDB } from "@/lib/db";
import User from "@/lib/models/Users";
import EditMangerForm from "@/components/EditMangerForm"; // move your current component to a separate file
import Teams from "@/lib/models/Teams";
import Clubs from "@/lib/models/Clubs";
import Leagues from "@/lib/models/Leagues";

export default async function EditLeaguePage({ params }) {
  const id = (await params).id;

  await connectDB();
  const user = await User.findById(id).populate({
    path: "team_id",
    select: "name club",
    populate: {
      path: "club",
      model: "Clubs",
      select: "label name league", // whatever fields you want
      populate: {
        path: "league",
        model: "Leagues",
        select: "label title", // whatever fields you want
      }
    }
  }).lean();
  return <EditMangerForm user={JSON.parse(JSON.stringify(user))} />;
}
