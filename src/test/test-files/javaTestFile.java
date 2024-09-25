public class Test {
    public static void main(String[] args) {
        System.out.println("This is a log in Java.");
        System.out.println("This should be removed.");
        System.out.println("Keep this line.");

        testMethod();
    }

    public static void testMethod() {
        System.out.println("Log from testMethod.");
    }
}
