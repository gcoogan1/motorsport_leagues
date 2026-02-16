import { useAppTheme } from "@/providers/theme/useTheme";
import { LogoThemes } from "@/app/design/logoThemes";
import { Container, SubTitle, Wrapper } from "./Homepage.styles";

//TODO: Remove this when the homepage is ready. This is just for testing the profile select input component.

// const HomepageContent = () => {
//   const { watch } = useFormContext();
//   const selectedProfile = watch("profile");

//   return (
//     <div style={{ width: "416px" }}>
//       <ProfileSelectInput
//         fieldLabel="Select Profile"
//         name="profile"
//         isLarge
//         profiles={[
//           {
//             label: "JohnDoe",
//             value: "john_doe",
//             avatar: {
//               avatarType: "preset",
//               avatarValue: "blue",
//             },
//             secondaryInfo: "Game",
//           },
//           {
//             label: "JaneSmith",
//             value: "jane_smidth",
//             avatar: {
//               avatarType: "preset",
//               avatarValue: "red",
//             },
//             secondaryInfo: "Game",
//           },
//           {
//             label: "TomJohnson",
//             value: "tom_johnson",
//             avatar: {
//               avatarType: "preset",
//               avatarValue: "green",
//             },
//             secondaryInfo: "Game",
//           },
//         ]}
//       />
//       {selectedProfile && <p>Selected: {selectedProfile}</p>}
//     </div>
//   );
// };

const Homepage = () => {
  // Theme
  const { themeName } = useAppTheme();
  const LogoIcon = LogoThemes[themeName];

  // const formMethods = useForm({
  //   defaultValues: {
  //     profile: "",
  //   },
  // });

  return (
    <Wrapper>
      <Container>
        <LogoIcon />
        <SubTitle>Coming Soon</SubTitle>
      </Container>
    </Wrapper>
  );
};

export default Homepage;
