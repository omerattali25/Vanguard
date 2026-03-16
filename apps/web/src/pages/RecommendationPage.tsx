import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useRecommendations } from "api/recommendations/recommendations.query";

export const Recommendations = () => {
  const navigate = useNavigate();
  const { data, isPending, error } = useRecommendations();

  if (isPending) {
    return (
      <div className="flex justify-center mt-10">
        <div className="w-full md:w-1/2 space-y-4">
          <Skeleton className="h-8 w-40 mx-auto" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <Table className="w-full md:w-1/2 mt-10 border mx-auto">
        <TableCaption>מטופלים</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">מדד סיכון</TableHead>
            <TableHead className="text-center">שם המטופל</TableHead>
            <TableHead className="text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
           {data?.map((patient) => {
                      return (
                        <TableRow
                          onClick={() => {
                            navigate(`/patients/${patient.id}`);
                          }}
                          className="cursor-pointer hover:bg-muted"
                        >
                          <TableCell className="text-center">{patient.name}</TableCell>
                          <TableCell className="text-center">{patient.score}</TableCell>
                        </TableRow>
                      );
                    })}
        </TableBody>
      </Table>
    </>
  );
};

export default Recommendations;
