"use client";
// import Header from "@/components/Header";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSun, faPlus } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import Header from "@/components/Headers";

interface Project {
  ID: number;
  Title: string;
  Description: string;
}

const Dashboard = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [showLoginPrompt, setShowLoginPrompt] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const justlandedhere = async () => {
  //   try {
  //     const tokenPayload = await axios.post("/api/projects");
  //     const accessToken = tokenPayload.data.accessToken;
  //     console.log(accessToken, "just checking");
  //     console.log(user, " this is the user");

  //     const response = await axios.post(
  //       "http://localhost:3100/createUser",
  //       {
  //         email: user?.email,
  //         Name: user?.name,
  //         Picture: user?.picture,
  //         Username: user?.nickname,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );

  //     const errorDescription = response.data.error_description;
  //     const postResonse = response.data.access_token;
  //     console.log(postResonse, "this is the token");
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // useEffect(() => {
  //   // Send the request to the backend
  //   justlandedhere();
  // }, [user]);

  const handleOpenDraft = (projectId: number) => {
    router.push(`/project-draft?projectId=${projectId}`);
  };

  const openNewProject = () => {
    router.push("/create-project");
  };
  const handleOpenProject = async (title: string) => {
    try {
      const tokenPayload = await axios.post("/api/projects");
      const accessToken = tokenPayload.data.accessToken;
      // Check if code space already exists for the project
      console.log(title)
      const response = await axios.post(
        "http://localhost:3100/create_space",
        {
          username: user?.nickname,
          repoName: title,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data, "just checking");
      const { message, codespace } = response.data;

      console.log(message, "this the message");

      // If a code space already exists, redirect to the codespace URL
      if (message === "Codespace created successfully" && codespace) {

        try {
          // Make a PUT request to updateProject endpoint
          const updateProjectResponse = await axios.put(
            "http://localhost:3100/updateProject",
            {
              title: title,
              codeSpaceUrl: codespace.web_url,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
  
          console.log(updateProjectResponse.data, "Update Project response");
  
          // Redirect to the codespace URL
          const codespaceUrl = codespace.web_url;
          window.location.href = codespaceUrl;
        } catch (updateError) {
          console.error("Error updating project:", updateError);
          // Handle update error if needed
        }
      } else if (message ==="Codespace already exists") {
        console.log(response.data, "this good")
        const {  codeSpacUrl } = response.data;
        window.location.href = codeSpacUrl;
      }
      else {
        console.log(message);
        // Handle other cases if needed
      }
    } catch (error) {
      console.error("Error opening project:", error);
    }
  };
  const handleDeleteProject = async (projectId: any) => {
    console.log(`Project ID: ${projectId}`);
    try {
      const response = await axios.delete(
        `api/projects/?projectId=${projectId}`
      );
      if (response.status === 200) {
        // If deletion is successful, you may want to update the projects list
        const updatedProjects = projects.filter(
          (project) => project.ID !== projectId
        );
        setProjects(updatedProjects);
        console.log(`Project with ID ${projectId} deleted successfully.`);
      } else {
        console.error(`Error deleting project with ID ${projectId}.`);
      }
    } catch (error) {
      console.log(error);
      console.error(`Error deleting project with ID ${projectId}:`, error);
    }
  };
  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await axios.get("api/projects");
        // console.log(response, "this the response")
        setProjects(response.data.projects);
        // setLoading(false)
        console.log(projects, "this is 2it");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchProjects();
  }, [user, isLoading]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
