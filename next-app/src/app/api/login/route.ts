import { NextResponse } from 'next/server';
import { connectDB } from '@/services/dbManagement';
import { LoginFormValues } from '@/services/auth/actions';

export async function POST(req: Request) {
  try {
    const body: LoginFormValues = await req.json();
    const { loginOrEmail, password } = body;

    if (!loginOrEmail || !password) {
      return NextResponse.json({ error: 'Brakuje danych logowania' }, { status: 400 });
    }

    const db = await connectDB();
    const usersCollection = db.collection('users'); // w bazie "v1"

    // Szukaj po loginie lub emailu (zakładamy, że login = email)
    const user = await usersCollection.findOne({
      email: loginOrEmail,
    });

    if (!user) {
      return NextResponse.json({ error: 'Nieprawidłowy email lub hasło' }, { status: 401 });
    }

    // Sprawdzenie hasła (na razie bez hashowania)
    if (user.password !== password) {
      return NextResponse.json({ error: 'Nieprawidłowy email lub hasło' }, { status: 401 });
    }

    // Zwróć dane użytkownika (bez hasła!)
    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        surname: user.surname,
      },
    });
  } catch (error) {
    console.error('Błąd logowania:', error);
    return NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500 });
  }
}