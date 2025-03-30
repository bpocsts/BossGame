import { GoogleLogin } from "@react-oauth/google";

export function Googlelogin() {
    return (
        <>
        <Googlelogin
        onSuccess = {(credentialResponse) => 
        console.log(credentialResponse)
        }
        onFailure = {(error) =>
        console.log(error)
        }
        />
        </>
    );
    }
