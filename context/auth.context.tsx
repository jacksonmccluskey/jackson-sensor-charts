import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { callLogin } from '../api/login.api';
import { config } from '../config';

interface IAuthContext {
	jwt: string | null;
	setJWT?: React.Dispatch<React.SetStateAction<string | null>>;
	apiKey: string | null;
	setAPIKey?: React.Dispatch<React.SetStateAction<string | null>>;
	orgId: number | null;
	setOrgId?: React.Dispatch<React.SetStateAction<number | null>>;
	orgName: string | null;
	setOrgName?: React.Dispatch<React.SetStateAction<string | null>>;
}

const currentDate = new Date();
const pastDate = new Date(currentDate);
pastDate.setDate(currentDate.getDate() - 30);

const AuthContext = createContext<IAuthContext>({
	jwt: null,
	apiKey: null,
	orgId: null,
	orgName: null,
});

export const AuthProvider = ({ children }) => {
	const router = useRouter();

	const [jwt, setJWT] = useState<string | null>(null);

	const [apiKey, setAPIKey] = useState<string | null>(null); // TODO: Check Login With JWT

	const [orgId, setOrgId] = useState<number | null>(null); // TODO: Check Login With JWT

	const [orgName, setOrgName] = useState<string | null>(null); // TODO: Check Login With JWT

	useEffect(() => {
		if (!router.isReady) return;

		const jwtParam = Array.isArray(router.query.jwt)
			? router.query.jwt[0]
			: router.query.jwt;

		if (jwtParam && setJWT) {
			setJWT(jwtParam);
		}
	}, [router.isReady, router.query.jwt, setJWT]);

	useEffect(() => {
		const getUserInfo = async () => {
			if (jwt) {
				try {
					const { apiKey, orgId } = await callLogin({ jwt });
					setAPIKey(apiKey);
					setOrgId(orgId);
				} catch (error) {
					if (config.apiKeyTester && config.ordIdTester) {
						setAPIKey(config.apiKeyTester);
						setOrgId(config.ordIdTester);
					}
				}
			}
		};

		getUserInfo();
	}, [jwt, setAPIKey, setOrgId]);

	return (
		<AuthContext.Provider
			value={{
				jwt: jwt ?? config.jwtTester,
				setJWT,
				apiKey,
				setAPIKey,
				orgId,
				setOrgId,
				orgName,
				setOrgName,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthContext = () => useContext(AuthContext);

/* 
TODO: Get Login Data With JWT

{
  "data": {
    "orgId": 0,
    "apiKey": "string",
    "orgName": "string",
  }
}
*/
