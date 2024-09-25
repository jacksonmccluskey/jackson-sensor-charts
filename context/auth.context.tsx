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

		try {
			const jwtParam = Array.isArray(router.query.jwt)
				? router.query.jwt[0]
				: router.query.jwt;

			if (jwtParam && setJWT) {
				setJWT(jwtParam);
			}

			const orgIdParam = Array.isArray(router.query.orgId)
				? parseInt(router.query.orgId[0])
				: parseInt(router.query.orgId);

			if (orgIdParam && setOrgId) {
				setOrgId(orgIdParam);
			}
		} catch {}
	}, [router.isReady, router.query.jwt, router.query.orgId, setJWT, setOrgId]);

	useEffect(() => {
		const getUserInfo = async () => {
			if (jwt) {
				try {
					const { apiKey } = await callLogin({ jwt });
					setAPIKey(apiKey);
				} catch (error) {
					if (config.apiKeyTester) {
						setAPIKey(config.apiKeyTester);
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
